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
