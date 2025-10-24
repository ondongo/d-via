'use server'

import { prisma } from "@/configs/prisma/prisma"

export async function getBlogPosts() {
  const posts = await prisma.blog.findMany()
  return posts
}

export async function getBlogPost(slug: string) {
  const post = await prisma.blog.findUnique({ where: { slug : slug } })
  return post
}



export async function updateBlogPost(id: string, title: string, content: string) {
  const post = await prisma.blog.update({ where: { id }, data: { title, content } })
  return post
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blog.delete({ where: { id } })
  return post
}