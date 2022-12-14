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

## 한 model 에서 다른 model 두번 참조

: name을 활용하여 relation 해줘야 함

```prisma
model User{
  id             Int         @id @default(autoincrement())
  createAt       DateTime    @default(now())
  updateAt       DateTime    @updatedAt
  writtenReviews Review[]    @relation(name: "writtenReviews")
  receiveReviews Review[]    @relation(name: "receiveReviews")
}
model Review {
  id          Int      @id @default(autoincrement())
  createAt    DateTime @default(now())
  updateAt    DateTime @updatedAt
  createBy    User     @relation(name: "writtenReviews", fields: [createById], references: [id])
  createById  Int
  createFor   User     @relation(name: "receiveReviews", fields: [createForId], references: [id])
  createForId Int
}
```

## enums

enum을 활용한 경우, 아래 예시를 참고해보자(리팩토링할때 꼭 enum으로 바꿔보자)

```prisma
model Product {
  id          Int        @id @default(autoincrement())
  createAt    DateTime   @default(now())
  updateAt    DateTime   @updatedAt
  userId      Int
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  image       String
  name        String
  price       Int
  description String     @db.MediumText
  favorites   Favorite[]
  sales       Sale[]
  purchases   Purchase[]
}

model Sale {
  id        Int      @id @default(autoincrement())
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    Int
  productId Int
}

model Purchase {
  id        Int      @id @default(autoincrement())
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    Int
  productId Int
}

model Favorite {
  id        Int      @id @default(autoincrement())
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    Int
  productId Int
}
```

위 세 모델은 구조가 같다 이럴 경우 enum을 활용할 수 있다.

```prisma
model Product {
  id          Int        @id @default(autoincrement())
  createAt    DateTime   @default(now())
  updateAt    DateTime   @updatedAt
  userId      Int
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  image       String
  name        String
  price       Int
  description String     @db.MediumText
  records     Record[]
}
model Record{
    id        Int      @id @default(autoincrement())
  createAt  DateTime @default(now())
  updateAt  DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    Int
  productId Int
  kind      Kind
}
enum Kind{
  Purchase
  Sale
  Favorite
}
```

## model table을 수정했을때 발생되는 오류

1. 기존에 DB에 있던 Data가 추가되는 column을 갖지 않았을 경우.
   - 해결 방법
     1. model에 default값을 넣어준다.
     2. required를 해제시킨다.

## select 내부에 where 적용

```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["referentialIntegrity", "filteredRelationCount"]
}
```

previewFeatures 배열 내에 "filteredRelationCount"를 추가해주면 적용 가능

## seed

: 테스트 데이터를 빠르게 만드는 방법

1. prisma 폴더에 seed.ts 생성
2. seed.ts 작성

```ts
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
function main() {
  [...Array.from(Array(500).keys())].forEach(async (item) => {
    await client.stream.create({
      data: {
        product: {
          connect: {
            id: 8,
          },
        },
        user: {
          connect: {
            id: 4,
          },
        },
      },
    });
  });
}
main();
```

3. package.json 수정

```json
{
  // ...
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

: `npx prisma db seed` 명령어 입력하면 seed.ts 실행

4. ts-node 설치
5. `npx prisma db seed` 명령 실행, 가짜 데이터 생성 완료

## Pagination

:pagination은 웬만하면 구현하는게 좋다.
option 중에 take,skip 옵션을 활용하면 페이지네이션 가능

````ts
await client.stream.findMany({
      take: 5, //5개만 가져오기
      skip:5, // 5개 건너 뛰기
      include: {
        user: true,
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
    ```
````

5개만 가져오기

## query 기록 보기
