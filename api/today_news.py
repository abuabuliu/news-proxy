import os
import datetime
import requests

def handler(request):
    GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
    REPO = 'abuabuliu/news-collector'

    today = datetime.datetime.now().strftime('%Y-%m-%d')
    filename = f'{today}_a-News.json'
    url = f'https://api.github.com/repos/{REPO}/contents/{filename}'
    headers = {'Authorization': f'token {GITHUB_TOKEN}'}
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        content = r.json()['content']
        import base64
        decoded = base64.b64decode(content).decode('utf-8')
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": decoded
        }
    else:
        return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": '{"error": "今天沒有新增訊息"}'
        }
