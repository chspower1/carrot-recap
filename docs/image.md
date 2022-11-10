# Image 업로드 메모

- ## **Type**
        : file type은 FileList
- ## **미리보기**

        - react-hook-form의 watch를 이용
        - blob은 메모리에 존재(프론트엔드에서는 존재하지 않음)
        - ```ts
          useEffect(() => {
            if (avator && avator.length > 0) {
              console.log(avator);
              const file = avator[0];
              console.log(URL.createObjectURL(file));
              setImagePreview(URL.createObjectURL(file));
            }
          }, [avator]);
          ```

- ## **업로드 방식 세가지**

        1. File ---> Server ---> CloudFlare (비용을 많이 지불해야됨)
        2. File ---> CloudFlare (API key 노출로 불가)
        3. 브라우저 : 나 파일 있어요 ---> 서버: 오 클라우드 한테 url요청함 ---> 클라우드 : 오키 빈공간 만들고 url줌 ---> 서버: url 받아옴 ---> 브라우저 : 오키, 유저 여기다 저장하셈

- ## **업로드 가이드**

      1. input 에 file 받기
        ```ts
        <input {...register("avatar")} id="picture" type="file" className="hidden" accept="image/*" />
        ```

      2. onvalid 함수에서 file을 받았는지 체크
      3. files.ts에서 cloudflare에 url 요청
      4. 받아온 url로 body에 업로드한 파일을 넣어서 post요청
      5. 요청 후 넘겨받은 id를 avator에 넣어서 profile mutation
      6. profile img에 `https://imagedelivery.net/AbuMCvvnFZBtmCKKJV_e6Q/${user?.avatar}/public` src 연결

  ```ts
  // onValid함수
  const onValid = async ({ name, email, phone }: EditForm) => {
    console.log(name, email, phone);
    // 파일을 받았는지 체크
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", avatar[0], user.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      console.log(id);
      editProfile({ name, email, phone, avatar: id });
    }
    editProfile({ name, email, phone });
  };
  ```

  ```ts
  // files.ts
  import { NextApiRequest, NextApiResponse } from "next";
  import withHandler, { ResponseType } from "@libs/servwithHandler";
   import client from "@libs/server/client";
  import { withApiSession } from "@libs/server/withSession";

  async function handler(req: NextApiRequest, reNextApiResponse<ResponseType>) {
    const response = await (
       await fetch(
         `https://api.cloudflare.com/client/v4/accounts/${proceenv.CF_ID}/images/v1/direct_upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
           },
        }
      )
    ).json();
    res.json({
       ok: true,
      ...response.result,
    });
  }

   export default withApiSession(
     withHandler({
       methods: ["GET"],
       handler,
     })
   );
  ```

- ## **Resizing**
  variant를 활용
  https://dash.cloudflare.com/fa637151032b026d49919b47e45b8213/images/variants

1. variant 생성
2. Resizing Option에서 수정

- ## **NEXT Image Component**
  : 자체적으로 lazy loading을 해줌

1. local image
   1. img를 import, src에 연결
2. remote image
   1. next.config를 설정해줘야함
