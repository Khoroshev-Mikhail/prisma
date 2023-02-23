import React from "react"
import { GetStaticProps } from "next"
import prisma from '../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ks: 1
    }
  }
}


const Blog = () => {
  return (
    <h1 className="text-3xl font-bold underline bg-sky-500">
      Главная
    </h1>
  )
}

export default Blog
