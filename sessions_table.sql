-- Table: public.sessions

-- DROP TABLE IF EXISTS public.sessions;

CREATE TABLE IF NOT EXISTS public.sessions
(
    uuid uuid NOT NULL DEFAULT uuid_generate_v4(),
    host_id uuid,
    game_title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    max_guests smallint NOT NULL,
    num_guests smallint DEFAULT 0,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone,
    address character varying(100) COLLATE pg_catalog."default",
    is_full boolean DEFAULT false,
    expires_at timestamp with time zone GENERATED ALWAYS AS ((date + end_time)) STORED,
    created_at timestamp with time zone DEFAULT now(),
    last_updated timestamp with time zone,
    game_image character varying COLLATE pg_catalog."default" DEFAULT 'https://cf.geekdo-images.com/zxVVmggfpHJpmnJY9j-k1w__imagepage/img/6AJ0hDAeJlICZkzaeIhZA_fSiAI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1657689.jpg'::character varying,
    CONSTRAINT sessions_pkey PRIMARY KEY (uuid),
    CONSTRAINT sessions_host_id_fkey FOREIGN KEY (host_id)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sessions
    OWNER to wensong;

-- Trigger: session_updates

-- DROP TRIGGER IF EXISTS session_updates ON public.sessions;

CREATE OR REPLACE TRIGGER session_updates
    BEFORE UPDATE 
    ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.log_last_update();