import { PostDetail } from "../../../../components/PostDetail/PostDetail";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="pt-10 font-[family-name:var(--font-geist-sans)]">
      <main>
        <PostDetail id={id} />
      </main>
    </div>
  );
}
