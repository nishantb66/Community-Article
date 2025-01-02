import Link from "next/link";

const Header = () => (
  <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold">Community Articles</h1>
    <nav className="flex space-x-4">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/create" className="hover:underline">
        Write Article
      </Link>
    </nav>
  </header>
);

export default Header;
