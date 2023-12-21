-- FUNCTION: public.update_num_guests()

-- DROP FUNCTION IF EXISTS public.update_num_guests();

CREATE OR REPLACE FUNCTION public.update_num_guests()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	IF (TG_OP = 'INSERT') THEN
		UPDATE sessions SET num_guests = num_guests + 1 WHERE uuid = NEW.session_id;
	ELSIF (TG_OP = 'DELETE') THEN
		UPDATE sessions SET num_guests = num_guests - 1 WHERE uuid = OLD.session_id;
	END IF;
	RETURN NULL;
END;
$BODY$;

ALTER FUNCTION public.update_num_guests()
    OWNER TO wensong;
