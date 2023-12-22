-- Table: public.roles

-- DROP TABLE IF EXISTS public.roles;

CREATE TABLE IF NOT EXISTS public.roles
(
    role character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (role)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to wensong;

INSERT INTO roles(role) VALUES('USER')
INSERT INTO roles(role) VALUES('ADMIN')