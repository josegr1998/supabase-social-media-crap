import { PostList } from "../../components/PostList/PostList";

export default function Home() {
  return (
    <div className="pt-10 font-[family-name:var(--font-geist-sans)]">
      <main>
        <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Recent Posts
        </h2>
        <PostList />
      </main>
    </div>
  );
}
