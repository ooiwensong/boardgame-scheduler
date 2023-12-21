-- Table: public.guests

-- DROP TABLE IF EXISTS public.guests;

CREATE TABLE IF NOT EXISTS public.guests
(
    session_id uuid NOT NULL,
    guest_id uuid NOT NULL,
    date_joined timestamp with time zone DEFAULT now(),
    CONSTRAINT guests_pkey PRIMARY KEY (session_id, guest_id),
    CONSTRAINT guests_guest_id_fkey FOREIGN KEY (guest_id)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT guests_session_id_fkey FOREIGN KEY (session_id)
        REFERENCES public.sessions (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.guests
    OWNER to wensong;

-- Trigger: guests_updates

-- DROP TRIGGER IF EXISTS guests_updates ON public.guests;

CREATE OR REPLACE TRIGGER guests_updates
    AFTER INSERT OR DELETE
    ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_num_guests();