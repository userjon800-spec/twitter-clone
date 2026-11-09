export type SearchParams = { [key: string]: string | string[] | undefined };
export interface QueryProps {
  params: string;
  key: string;
  value?: string | null;
}
export interface IUser {
  createdAt: Date;
  username: string;
  email: string;
  name: string;
  profileImage: string;
  coverImage: string;
  updatedAt: Date;
  _id: string;
  bio: string;
  location: string;
  followers: string[];
  following: string[];
  hasNewNotifications: boolean;
  notifications: string[];
  bookmarks?: string[];
  isFollowing: boolean;
}
export interface IPost {
  body: string;
  image?: string;
  comments: number;
  createdAt: string;
  likes: number;
  reposts?: number;
  updatedAt: string;
  user: IUser;
  _id: string;
  hasLiked: boolean;
  hasReposted?: boolean;
  hasBookmarked?: boolean;
}
export interface ReturnActionType {
  posts?: IPost[];
  comments?: IPost[];
  isNext?: boolean;
  failure?: string;
  status?: number;
  post?: IPost;
  users?: IUser[];
  notifications?: IPost[];
  user?: IUser;
}
