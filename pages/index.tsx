import React from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  })
  return { 
    props: { feed }, 
    revalidate: 10 
  }
}


const Blog = (props) => {
  return (
    <h1 className="text-3xl font-bold underline bg-sky-500">
      Главная
    </h1>
  )
}

export default Blog
