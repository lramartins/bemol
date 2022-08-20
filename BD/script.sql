create table tbl_users
(
	pk_user serial primary key not null,
	first_name varchar(20) not null,
	last_name varchar(30) not null,
	email varchar(100) unique not null,
	user_password varchar(255) not null,
	active boolean not null default true,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	
	constraint ck_active_users check (active = true or active = false)
);

create table tbl_address
(
	pk_address serial primary key not null,
	zipcode char(8) unique not null,
	street varchar(100) not null,
	district varchar(50) not null,
	city varchar(50) not null,
	state char(2) not null,
	country varchar(20) not null,
	active boolean not null default true,

	constraint ck_active_address check (active = true or active = false)
);

create table tbl_address_user
(
	pk_address_user serial primary key not null,
	fk_user INT references tbl_users(pk_user) not null,
	fk_address INT references tbl_address(pk_address),
	zipcode char(8),
	street varchar(100),
	district varchar(50),
	city varchar(50),
	state char(2),
	country varchar(20),
	address_number VARCHAR(6),
	complement VARCHAR(100),
	active boolean not null default true,
	created_at timestamp default current_timestamp,
	updated_at timestamp,

	constraint ck_active_address_user check (active = true or active = false)
);