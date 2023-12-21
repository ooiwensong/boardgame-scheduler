-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    uuid uuid NOT NULL DEFAULT uuid_generate_v4(),
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    hash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    username character varying(25) COLLATE pg_catalog."default",
    avatar character varying COLLATE pg_catalog."default" DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'::character varying,
    role character varying(10) COLLATE pg_catalog."default" DEFAULT 'USER'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (uuid),
    CONSTRAINT users_role_fkey FOREIGN KEY (role)
        REFERENCES public.roles (role) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to wensong;