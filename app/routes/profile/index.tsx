import { MetaFunction } from "remix";

export const meta: MetaFunction = () => ({
    title: "So great, it's funny!",
    description: "Some dad jokes and more for you!",
    "og:title": "So great, it's funny!",
    "og:description": "Some dad jokes and more for you!"
});


export default function Profile() {
    return (
        <div className="container">
            <div className="content">
                <h1>Profile</h1>
            </div>
        </div>
        
    )
}
