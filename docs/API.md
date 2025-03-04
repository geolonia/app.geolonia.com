# API仕様書
## 認証方式
- Cognito
- JWT認証
- Barerトークン

## 主要なエンドポイント

## チーム関連 API
### チーム管理
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| POST | /teams | チーム作成 |
| GET | /teams | チーム一覧取得 |
| DELETE | /teams/{teamId} | チーム削除 |
| PUT | /teams/{teamId} | チーム情報更新 |

### チームメンバー管理
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| GET | /teams/{teamId}/members | メンバー一覧取得 |
| DELETE | /teams/{teamId}/members/{memberSub} | メンバー削除 |
| PUT | /teams/{teamId}/members/{memberSub} | メンバー情報更新 |

### 招待機能
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| POST | /teams/{teamId}/invitation | メンバー招待 |
| GET | /teams/{teamId}/invitations | 招待一覧取得 |
| POST | /accept-invitation | 招待受諾 |

### 支払い関連
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| POST | /teams/{teamId}/payment | 支払い情報更新 |
| GET | /teams/{teamId}/plan | プラン情報取得 |
| PUT | /teams/{teamId}/plan | プラン変更 |
| GET | /teams/{teamId}/invoices | 請求書一覧 |
| GET | /teams/{teamId}/charges | 課金履歴 |

### API キー管理
#### APIキー操作
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| POST | /teams/{teamId}/keys | APIキー作成 |
| GET | /teams/{teamId}/keys | APIキー一覧取得 |
| DELETE | /teams/{teamId}/keys/{keyId} | APIキー削除 |
| PUT | /teams/{teamId}/keys/{keyId} | APIキー更新 |

### スプライト管理
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| POST | /teams/{teamId}/keys/{keyId}/sprites/{spriteId} | スプライト作成 |
| DELETE | /teams/{teamId}/keys/{keyId}/sprites/{spriteId} | スプライト削除 |
| GET | /teams/{teamId}/keys/{keyId}/sprites | スプライト一覧取得 |

### ユーザー関連
#### ユーザー情報
| メソッド | パス | 内容 |
| ---- | ---- | ---- |
| GET | /users/{userSub} | ユーザー情報取得 |
| PUT | /users/{userSub} | ユーザー情報更新 |
| GET | /users/{userSub}/avatar/links | アバター画像URL取得 |
| POST | /users/{userSub}/access-token | アクセストークン作成 |


## 環境

- 開発環境 (dev)
- 本番環境 (v1)
- テスト環境 (test)


## エラーハンドリング
主なHTTPステータスコード
- 400: リクエスト不正
- 401: 認証エラー
- 402: 支払い要求
- 403: 権限なし
- 404: リソース未発見
- 500: サーバーエラー
