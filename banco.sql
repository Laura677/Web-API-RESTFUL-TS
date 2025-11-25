-- Active: 1763336068907@@127.0.0.1@3306@dados
create database dados;
use dados;

create table estudante(
id int auto_increment not null,
nome varchar(20) null,
primary key(id));

insert into estudante values
(1, 'Bruno'),
(2, 'Vivian'),
(3, 'Marco');


alter table estudante
add column email varchar(100);

select * from estudante;