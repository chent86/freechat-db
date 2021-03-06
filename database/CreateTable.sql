create table user(user_id int not null auto_increment,
                  primary key(user_id),
                  username char(50) not null,
                  unique key(username),
                  password char(50) not null,
                  avatar MEDIUMTEXT,
                  cover MEDIUMTEXT,
                  index name(username(10), password(10))
)CHARSET=utf8;

create table has_friend(from_id int not null,
                        to_id int not null,
                        created_at char(20),
                        updated_at char(20),
                        foreign key(from_id) references user(user_id) on delete cascade,
                        foreign key(to_id) references user(user_id) on delete cascade,
                        primary key(from_id, to_id)
                        )CHARSET=utf8;

create table post(post_id int not null auto_increment,
                  primary key(post_id),
                  text TEXT,
                  image MEDIUMTEXT,
                  created_at char(20),
                  updated_at char(20),
                  user_id int not null,
                  foreign key(user_id) references user(user_id) on delete cascade
)CHARSET=utf8;

create table liked(user_id int not null,
                post_id int not null,
                created_at char(20),
                updated_at char(20),
                foreign key(user_id) references user(user_id) on delete cascade,
                foreign key(post_id) references post(post_id) on delete cascade,
                primary key(user_id, post_id)
                )CHARSET=utf8;

create table comment(user_id int not null,
                post_id int not null,
                created_at char(20),
                updated_at char(20),
                foreign key(user_id) references user(user_id) on delete cascade,
                foreign key(post_id) references post(post_id) on delete cascade,
                content varchar(1000)
                )CHARSET=utf8;

create table session(user_id int not null,
                value char(50),
                created_at char(20),
                updated_at char(20),
                foreign key(user_id) references user(user_id) on delete cascade,
                primary key(user_id),
                index using hash(value)
                ) engine=memory;