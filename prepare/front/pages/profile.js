import AppLayout from "../components/AppLayout";
import Head from "next/head";

const Profile = () => {
	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<h1>Profile page</h1>
			</AppLayout>
		</>
	);
};

export default Profile;
