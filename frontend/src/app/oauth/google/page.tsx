"use client";

import OAuthPage from "@/components/auth/oauth/oauth";

const Page = () => {
    const url = `http://localhost:8000/api/users/google/callback/?code=`;
    return (
        <div> <OAuthPage url={url} /> </div>
    )
}

export default Page;