# Next 메모

## .env 브라우저에서 활용하기

NEXT_PUBLIC_IMG_URL=...  
앞에 NEXT_PUBLIC을 사용해야 프론트에서 사용 가능

## middleware

1. page or src랑 같은 레벨에 위치 시키기
2. 파일 이름은 middleware.ts
3. path 경로 지정
   ```ts
   export const config = {
     matcher: "/about/:path*",
   };
   ```
   ```ts
   export const config = {
     matcher: ["/about/:path*", "/dashboard/:path*"],
   };
   ```
4. URL상태에 따라 설정해주고 싶은경우

   ```ts
   // middleware.ts

   import { NextResponse } from "next/server";
   import type { NextRequest } from "next/server";

   export function middleware(request: NextRequest) {
     if (request.nextUrl.pathname.startsWith("/about")) {
       return NextResponse.rewrite(new URL("/about-2", request.url));
     }

     if (request.nextUrl.pathname.startsWith("/dashboard")) {
       return NextResponse.rewrite(new URL("/dashboard/user", request.url));
     }
   }
   ```

5. api 요청에 있을때에도 실행
   api 요청을 막고싶다면 밑에 코드를 미들웨어에 추가 (api | \_next/static | favicon.ico 는 제외할 수 있음)

   ```ts
   export const config = {
     matcher: ["/((?!api|_next/static|favicon.ico).*)"],
   };
   ```

## NextResponse 를 통해 많은 것들을 할 수 있음

redirect,rewrite,json 등

## Dynamic import

: 서비스를 다 만들고 최적화 할 때 작업하는 것을 추천

```ts
import Bs from "@components/Bs";
```

```ts
import dynamic from 'next/dynamic'
const Bs = dynamic(()=>import("@components/Bs))
```

## \_document

: head,body 등 custom을 할 수 있음.  
 딱 한번만 랜더됨.
폰트는 구글폰트 사용, 구글 폰트 기반으로 최적화되어있음

## Script

: NextJS는 script 태그를 자체적으로 최적화 해주는 Script 컴포넌트가 있음
Script 컴포넌트의 params에 strategy가 있는데 이것은 script를 언제 불러올지 정할 수 있음

      ### strategy

      1.  "beforeInteractive"
          유저가 페이지하고 상호작용하기 전에 꼭! 스크립트를 먼저 불러와야 하는 경우(대부분의 경우 그럴 필요는 없음)
      2.  afterInteractive(default)
          페이지를 다 불러온 후 스크립트를 불러옴
      3.  lazyOnLoad
          다른 모든 데이터나 소스들을 불러오고 나서야 스크립트를 불러오는 전략

      ### onLoad

      :스크립트가 다 불러온 뒤 실행하는 함수

## getServerSideProps

: 서버단에서 실행됨, 페이지 컴포넌트가 서버단에서만 랜더링 됨  
유저의 요청이 발생할 때마다 호출됨.  
getServerSideProps를 사용하면 모든 데이터가 불러오기 전까지 페이지에 아무것도 보이지 않음,  
But client fetch를 하면 DB에서 불러오는 데이터 이외에 기본적인 것들은 먼저 보여주고 data가 fetch되면 나중에 data에 관련된 항목을 보여줌

- 장점
  - 몇몇 사람들은 로딩 상태에 있는 걸 원치 않음
- 단점
  - SWR,react-query 등 라이브러리의 장점을 활용하지 못함(cache,mutate 등)
  - getServerSideProps에서 에러가 나면 페이지 전체 UI가 안보임

## getServerSideProps + SWR

## getStaticProps

항상 서버에서 실행되고 클라이언트에서는 실행되지 않음.  
페이지가 빌드되고, NextJS가 해당 페이지를 export한 후 일반 HTML로 될 때, 딱 한 번만 실행됨
정적 HTML을 생성,

- pages와 같은 레벨에 posts폴더 생성

## getStaticPaths

blog/1  
blog/2
이런식으로 url을 구성하고 싶다면
blog
|-index.tsx
|-[slug].tsx
zz
