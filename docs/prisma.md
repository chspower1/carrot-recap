# prisma 메모

## schema.prisma

- model들을 데이터베이스에 push하고 SQL migration을 자동을 처리하기 위함
- Database와 상호작용하기 위해 client를 생성하고

## upsert (update + insert)

생성하거나 수정할 때 사용

```ts
await client.user.upsert({
  where: {},
  create: {},
  update: {},
});
```

## onDelete:Cascade

relation 관계일 때 해당 prop이 삭제되면 같이 삭제하는 옵션

## prisma client 중복 생성 방지

```ts
import { PrismaClient } from "@prisma/client";
declare global {
  var client: PrismaClient | undefined;
}
const client = global.client || new PrismaClient();
if (process.env.NODE_ENV === "development") global.client = client;
export default new PrismaClient();
```

## prisma로 검색하기

https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#or

```ts
const relatedProducts = await client.product.findMany({
  where: {
    OR: terms?.map((term) => ({
      name: {
        contains: term,
      },
    })),
    AND: {
      id: {
        not: product?.id,
      },
    },
  },
});
```

## delete의 성질

`clinet.favorite.delete()`로 삭제하려 한다면 unique인 성질을 가지고 있는 조건으로만 삭제할 수 있음
deleteMany는 unique가 아니더라도 가능함.