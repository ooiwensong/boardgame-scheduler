-- FUNCTION: public.log_last_update()

-- DROP FUNCTION IF EXISTS public.log_last_update();

CREATE OR REPLACE FUNCTION public.log_last_update()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	IF (NEW.max_guests = NEW.num_guests) THEN
		NEW.is_full := true;
	ELSE
		NEW.is_full := false;
	END IF;
	NEW.last_updated := NOW();
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.log_last_update()
    OWNER TO wensong;
