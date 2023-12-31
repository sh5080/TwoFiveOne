import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PostEntity } from "./post.entity";
@Entity({ name: "backtrack" })
export class BacktrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column()
  title: string;

  @Column("json", { array: true })
  backtrack: string[][][];

  @Column({ name: "created_at" })
  createdAt: string;

  @OneToMany(() => PostEntity, (post) => post.backtrack)
  posts!: PostEntity[];

  constructor(
    id: number,
    userId: number,
    title: string,
    backtrack: string[][][],
    createdAt: string
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.backtrack = backtrack;
    this.createdAt = createdAt;
  }
}
