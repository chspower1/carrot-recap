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

## return res.json()과 res.json() 차이점
```ts
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  // Request Info
  const {
    session: { user },
  } = req;
  console.log(user);
  // Product 목록 추출
  const products = await client.product.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      _count: {
        select: {
          records: {
            where: {
              kind: "Favorite",
            },
          },
        },
      },
    },
  });
  // 정상 리턴
  return res.json({
    ok: true,
    products,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
```
return에 관한 것인데요
위 함수에서 return이 있는것과 없는것은 크게 차이가 없어보이는데
(withHandler에서 오류를 검증하고 handler함수를 실행시키는 형식입니다.)
배우는 강의에서 보면 return을 하지않더라구요 (썼다가 지웠습니다.)

https://stackoverflow.com/questions/37726863/nodejs-difference-between-res-json-and-return-res-json
에 보면 return을 하지않지 않았을때 계속 실행되는 오류가 발생할 가능성이 있다고 이야기 합니다.

위 함수는 그런 위험은 없어보이지만 return을 붙이는게 오히려 더 정확해 보이는데 혹시 제가 모르는 이유가 있는 것일까요?


## NextJS 에서의 실시간 환경
: NextJS에서 serverless로 구축을 하면 실시간 소통을 만들 수 없다. server가 따로 필요하다.