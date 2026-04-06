import { Injectable } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import type { Post, PostInput } from '@app/models/post.model';

export interface BlogResult {
  success: boolean;
  post?: Post;
  error?: string;
}

export interface BlogDeleteResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  getAllPosts(): Post[] {
    const posts = this.storageService.getPosts();
    return posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  getPostById(postId: string): Post | null {
    if (!postId) {
      return null;
    }
    const posts = this.storageService.getPosts();
    return posts.find((p) => p.id === postId) ?? null;
  }

  createPost(postInput: PostInput): BlogResult {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to create a post.' };
    }

    const title = (postInput.title ?? '').trim();
    const content = (postInput.content ?? '').trim();

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' };
    }

    if (title.length > 100) {
      return { success: false, error: 'Title must be at most 100 characters.' };
    }

    if (content.length > 5000) {
      return { success: false, error: 'Content must be at most 5000 characters.' };
    }

    try {
      const posts = this.storageService.getPosts();
      const newPost: Post = {
        id: this.generateUUID(),
        title: title,
        content: content,
        createdAt: new Date().toISOString(),
        authorId: currentUser.user_id,
        authorName: currentUser.display_name,
      };

      posts.push(newPost);
      this.storageService.savePosts(posts);
      return { success: true, post: newPost };
    } catch {
      return { success: false, error: 'An error occurred while creating the post. Please try again.' };
    }
  }

  updatePost(postId: string, postInput: PostInput): BlogResult {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to update a post.' };
    }

    const title = (postInput.title ?? '').trim();
    const content = (postInput.content ?? '').trim();

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' };
    }

    if (title.length > 100) {
      return { success: false, error: 'Title must be at most 100 characters.' };
    }

    if (content.length > 5000) {
      return { success: false, error: 'Content must be at most 5000 characters.' };
    }

    try {
      const posts = this.storageService.getPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);

      if (postIndex === -1) {
        return { success: false, error: 'Post not found.' };
      }

      const post = posts[postIndex];

      if (currentUser.role !== 'admin' && post.authorId !== currentUser.user_id) {
        return { success: false, error: 'You are not authorized to update this post.' };
      }

      posts[postIndex] = {
        ...post,
        title: title,
        content: content,
      };

      this.storageService.savePosts(posts);
      return { success: true, post: posts[postIndex] };
    } catch {
      return { success: false, error: 'An error occurred while updating the post. Please try again.' };
    }
  }

  deletePost(postId: string): BlogDeleteResult {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to delete a post.' };
    }

    try {
      const posts = this.storageService.getPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);

      if (postIndex === -1) {
        return { success: false, error: 'Post not found.' };
      }

      const post = posts[postIndex];

      if (currentUser.role !== 'admin' && post.authorId !== currentUser.user_id) {
        return { success: false, error: 'You are not authorized to delete this post.' };
      }

      posts.splice(postIndex, 1);
      this.storageService.savePosts(posts);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred while deleting the post. Please try again.' };
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}