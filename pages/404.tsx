import Link from "next/link";

export default function ErrorPage() {
  return (
    <div>
      <div>Error</div>
      <Link href="/">
        <button>홈으로 돌아가기</button>
      </Link>
    </div>
  );
}
