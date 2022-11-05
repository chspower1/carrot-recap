# 회원인증 관련 메모

### 설계

1. phone입력
2. phone이랑 일치하는 유저가 있는지 확인
3. (있다면) Token을 유저의 phone으로 문자전송 (없다면) 회원가입
4. 유저는 Token을 브라우저에 입력
5. Token이 있는지 확인
6. 해당 Token을 가지고 있는 유저의 정보를 넘겨줌
7. 로그인 완료

## 인증방법은 Iron Session

### Iron Session?

:서명,암호화된 쿠키를 사용하는 NodeJS stateless session utility

JWT와 차이점  
: JWT는 서명, Iron Session은 유저 정보를 암호화 해서 쿠키로 전송

### 장점

1. JWT가 아님, 모든 정보를 암호화 했기 때문에 유저의 어떠한 정보도 확인 할 수 없음.
2. Session을 위한 백엔드 서버를 구축할 필요가 없음.

## useUser Hook

: 유저가 로그인했는지 판별하는 custom Hook

### logic

로그인 => router.replace("/")
비로그인 => router.replace("enter")

> push와 replace의 차이
> push는 history기록이 남음
