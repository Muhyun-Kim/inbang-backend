# 프로젝트 설명

- 이 프로젝트는 치지직, 숲 스트리머와 관련된 정보를 json형식으로 취득하는 api를 개발합니다.

### 스트리머 정보 조회

스트리머정보를 조회할 수 있습니다.

| HTTP Request  | Description   |
| ------------- | ------------- |
| GET /streamer | 스트리머 정보 |

#### Request Param

| Field    | Type       | required | Description            |
| -------- | ---------- | -------- | ---------------------- |
| platform | chzzk soop |          | 스트리머의 방송 플랫폼 |
| name     | String     |          | 스트리머이름           |
