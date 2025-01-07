export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-extrabold">simpleArticle Help Center</h1>
          <a
            href="/"
            className="bg-white text-blue-500 hover:text-indigo-500 py-2 px-6 rounded-full font-semibold shadow-md transition hover:shadow-lg"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-12 px-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            simpleArticle Rules
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            simpleArticle is an open platform that exists to share ideas and
            perspectives from the world’s most insightful writers, thinkers, and
            storytellers.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            We welcome thoughtful and civil discussion from a broad spectrum of
            viewpoints. To maintain a safe, respectful, and welcoming
            environment for a wide range of people to engage in meaningful
            conversations, we prohibit certain conduct.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            In deciding whether there has been a violation of the rules, we will
            take into consideration things like newsworthiness, the context and
            nature of the posted information, the likelihood and severity of
            actual or potential harms, account history, and applicable laws.
          </p>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Violations of our rules may result in consequences such as account
            restrictions, content removal, or suspension of access to our
            services. We aim to protect the integrity of our platform and ensure
            a respectful and safe environment for all users.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          © 2025 simpleArticle. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
