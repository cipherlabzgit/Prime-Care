import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>

      <Link to="/channeling">
        <button>Go To Channeling</button>
      </Link>
    </div>
  );
}

export default HomePage;