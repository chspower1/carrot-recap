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