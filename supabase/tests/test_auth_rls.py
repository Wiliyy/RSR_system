#!/usr/bin/env python3
"""Disposable integration test for Supabase Auth grants and RLS policies."""

import json
import os
import secrets
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

SERVER_ENV = Path(
    os.environ.get(
        'SUPABASE_TEST_ENV',
        Path.home() / '.hermes/profiles/vocabulary/.env',
    )
)


def load_env(path):
    values = {}
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        try:
            values[key] = json.loads(value)
        except json.JSONDecodeError:
            values[key] = value.strip().strip('"').strip("'")
    return values


def request(method, url, headers=None, body=None, expected=(200,)):
    payload = None if body is None else json.dumps(body).encode()
    merged = {'Content-Type': 'application/json', **(headers or {})}
    req = urllib.request.Request(url, data=payload, headers=merged, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            raw = response.read()
            parsed = json.loads(raw) if raw else None
            if response.status not in expected:
                raise AssertionError(f'{method} {url}: expected {expected}, got {response.status}')
            return response.status, parsed
    except urllib.error.HTTPError as error:
        raw = error.read()
        parsed = json.loads(raw) if raw else None
        if error.code not in expected:
            raise AssertionError(
                f'{method} {url}: expected {expected}, got {error.code}: {parsed}'
            ) from error
        return error.code, parsed


def main():
    env = load_env(SERVER_ENV)
    base = env['SUPABASE_URL'].rstrip('/')
    publishable = env['SUPABASE_PUBLISHABLE_KEY']
    secret = env['SUPABASE_SECRET_KEY']
    admin_headers = {'apikey': secret}
    public_headers = {'apikey': publishable}
    users = []

    def create_user(label):
        credentials = {
            'email': f'rls-{label}-{secrets.token_hex(6)}@example.com',
            'password': secrets.token_urlsafe(24),
        }
        _, user = request(
            'POST',
            f'{base}/auth/v1/admin/users',
            admin_headers,
            {**credentials, 'email_confirm': True},
        )
        users.append(user['id'])
        _, session = request(
            'POST',
            f'{base}/auth/v1/token?grant_type=password',
            public_headers,
            credentials,
        )
        return user['id'], {
            'apikey': publishable,
            'Authorization': f"Bearer {session['access_token']}",
        }

    try:
        user_a, headers_a = create_user('a')
        user_b, headers_b = create_user('b')

        request('GET', f'{base}/rest/v1/vocabulary?select=id', public_headers, expected=(401, 403))
        _, vocabulary = request('GET', f'{base}/rest/v1/vocabulary?select=id,word&order=id', headers_a)
        assert len(vocabulary) == 45

        request('POST', f'{base}/rest/v1/user_settings', headers_a, {
            'user_id': user_a,
            'daily_limit': 12,
            'timezone': 'Asia/Riyadh',
        }, expected=(201,))
        request('POST', f'{base}/rest/v1/user_settings', headers_b, {
            'user_id': user_b,
            'daily_limit': 8,
            'timezone': 'Asia/Riyadh',
        }, expected=(201,))

        _, own_settings = request('GET', f'{base}/rest/v1/user_settings?select=user_id,daily_limit', headers_a)
        assert own_settings == [{'user_id': user_a, 'daily_limit': 12}]
        request('POST', f'{base}/rest/v1/user_settings', headers_a, {
            'user_id': user_b,
            'daily_limit': 20,
            'timezone': 'Asia/Riyadh',
        }, expected=(401, 403))

        request('POST', f'{base}/rest/v1/user_progress', headers_a, {
            'user_id': user_a,
            'vocabulary_id': 1,
            'repetition': 1,
            'ease': 2.6,
            'interval_days': 1,
            'last_rating': 'good',
        }, expected=(201,))
        _, progress_a = request('GET', f'{base}/rest/v1/user_progress?select=user_id,vocabulary_id', headers_a)
        _, progress_b = request('GET', f'{base}/rest/v1/user_progress?select=user_id,vocabulary_id', headers_b)
        assert progress_a == [{'user_id': user_a, 'vocabulary_id': 1}]
        assert progress_b == []

        event_id = str(uuid.uuid4())
        request('POST', f'{base}/rest/v1/review_events', headers_a, {
            'client_event_id': event_id,
            'user_id': user_a,
            'vocabulary_id': 1,
            'rating': 'good',
            'grade': 5,
            'reviewed_at': '2026-09-14T00:00:00Z',
        }, expected=(201,))
        _, events_a = request('GET', f'{base}/rest/v1/review_events?select=client_event_id,user_id', headers_a)
        _, events_b = request('GET', f'{base}/rest/v1/review_events?select=client_event_id,user_id', headers_b)
        assert events_a == [{'client_event_id': event_id, 'user_id': user_a}]
        assert events_b == []
        request(
            'PATCH',
            f'{base}/rest/v1/review_events?client_event_id=eq.{urllib.parse.quote(event_id)}',
            headers_a,
            {'grade': 0},
            expected=(401, 403),
        )
        request('POST', f'{base}/rest/v1/vocabulary', headers_a, {
            'word': 'forbidden-client-word',
            'lang': 'en',
            'translation': 'ممنوع',
            'meaning': 'Must not be inserted by a browser client',
            'example': 'This insert should fail.',
            'level': 'intermediate',
            'tags': ['security', 'test'],
        }, expected=(401, 403))

        print('auth_email_password=passed')
        print('anon_access=denied')
        print('authenticated_vocabulary_rows=45')
        print('cross_user_access=denied')
        print('own_progress_access=passed')
        print('review_events_append_only=passed')
        print('client_vocabulary_insert=denied')
    finally:
        for user_id in users:
            request('DELETE', f'{base}/auth/v1/admin/users/{user_id}', admin_headers)
        for user_id in users:
            request('GET', f'{base}/auth/v1/admin/users/{user_id}', admin_headers, expected=(404,))
        print(f'temporary_users_deleted={len(users)}')


if __name__ == '__main__':
    main()
