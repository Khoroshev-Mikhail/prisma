import { Footer } from "flowbite-react";
import Link from "next/link";

export default function MyFooter(){
    return (
        <Footer container={true}>
            <Footer.Copyright by="ООО СиАрСиСи Рус" year={new Date().getFullYear()}/>
            <Footer.LinkGroup>
                {/* <Link href='https://t.me/Mikhail38'>Developed by Mikhail38</Link> */}
            </Footer.LinkGroup>
        </Footer>
    )
}