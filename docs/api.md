# API 메모

## headers의 작성 이유

Next는 req.body가 req의 인코딩을 기준으로 인코딩 됨,  
그래서 req.body.email 이런식으로 작성하면 undefined가 나옴  
이걸 해결하려면 frontEnd에서 headers를 설정해줘야됨,

```ts
//예시
fetch("/api/users/enter", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});
```

> ### header를 작성하지 않았을 경우
>
> req.body => {"email":"chs@naver.com"}
>
> ### header를 작성했을 경우
>
> req.body => {email:'chs@naver.com'}

## API route 규칙

1. function을 export default를 해줘야 함 ( 하지 않았을 경우, 호출되지 않음)

## handler와 withHandler

withHandler는 껍데기,

## SWR vs Tanstack-Query

https://goongoguma.github.io/2021/11/04/React-Query-vs-SWR/

## 페이지 구성 시스템

model 생성 => 데이터베이스 수정 => mutation => useSWR로 fetch

## Optimistic UI Update

: 백엔드에 요청을 보낼 때 백엔드의 응답을 기다리지 않고 변경사항을 반영하는 것
**SWR의 mutate를 이용**
`mutate(url,변경될 데이터,(boolean)refetch 했을때 값 불러올지 말지)`
단순히 refetch만 하고싶다면 `mutate(url)` 해주면 됨
