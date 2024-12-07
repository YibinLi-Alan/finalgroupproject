Use sql_login;
Drop table if exists users;
drop table if exists pdf_history;

create table users(
	id int auto_increment primary key,
    email varchar(100),
    password text
);

CREATE TABLE pdf_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid int not null,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (userid) references users(id)
);