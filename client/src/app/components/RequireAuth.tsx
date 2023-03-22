import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";
import Loader from "./Loader";

function RequireAuth() {
	const { user, status } = useAppSelector((store) => store.account);
	const location = useLocation();

	if (status == "loading") return <Loader />;

	if (!user) return <Navigate to="/login" state={{ from: location }} />;

	return <Outlet />;
}

export default RequireAuth;
