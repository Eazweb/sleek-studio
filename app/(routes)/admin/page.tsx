import Link from "next/link"

export const page=()=>{
    return(
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1>welcome back Admin!</h1>
            <ul>
                <li>
                <Link href='/admin/dashboard'>Dashboard</Link>
                </li>
                <li>
                <Link href='/admin/products'>Products</Link>
                </li>
                <li>
                <Link href='/admin/orders'>Orders</Link>
                </li>
                <li>
                <Link href='/admin/users'>Users</Link>
                </li>
            </ul>
        </div>
    )
}

export default page