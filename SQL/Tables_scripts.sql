-- Database: UN-Acarreo

-- DROP DATABASE "UN-Acarreo";

--CREATE DATABASE "UN-Acarreo"
--    WITH 
--    OWNER = postgres
--    ENCODING = 'UTF8'
--    LC_COLLATE = 'Spanish_Colombia.1252'
--    LC_CTYPE = 'Spanish_Colombia.1252'
--    TABLESPACE = pg_default
--    CONNECTION LIMIT = -1;

 -- Table: public."Bill"
 

 

-- Table: public."Cargo"
CREATE TABLE public."Cargo"
(
    "Id_cargo" serial NOT NULL,
    "Weight" integer NOT NULL,
    "Description" character varying COLLATE pg_catalog."default" NOT NULL,
    "Comments" character varying COLLATE pg_catalog."default",
    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("Id_cargo")
)

TABLESPACE pg_default;

ALTER TABLE public."Cargo"
    OWNER to postgres;

    -- Table: public."Driver"



CREATE TABLE public."Driver"
(
    "Id_driver" serial NOT NULL,
    "Driver_name" character varying COLLATE pg_catalog."default" NOT NULL,
    "Driver_last_name" character varying COLLATE pg_catalog."default" NOT NULL,
    "Driver_password" character varying COLLATE pg_catalog."default" NOT NULL,
    "Driver_address" character varying COLLATE pg_catalog."default" NOT NULL,
    "Driver_Email" character varying COLLATE pg_catalog."default" NOT NULL,
    "Average_rating" double precision,
    "Driver_photo" character varying COLLATE pg_catalog."default",
    "Driver_phone" bigint NOT NULL,
    "Identity_card" bigint NOT NULL,
    CONSTRAINT "Driver_pkey" PRIMARY KEY ("Id_driver"),
    CONSTRAINT "Driver_Email" UNIQUE ("Driver_Email"),
    CONSTRAINT "Driver_identity_card" UNIQUE ("Identity_card")
)

TABLESPACE pg_default;

ALTER TABLE public."Driver"
    OWNER to postgres;

    -- Table: public."Haulage"







CREATE TABLE public."Rating"
(
    "Id_rating" serial NOT NULL,
    "Puntuality" integer NOT NULL,
    "Cargo_state" integer NOT NULL,
    "Customer_support" integer NOT NULL,
    "Comments" character varying COLLATE pg_catalog."default",
    CONSTRAINT "Rating_pkey" PRIMARY KEY ("Id_rating")
)

TABLESPACE pg_default;

ALTER TABLE public."Rating"
    OWNER to postgres;

-- Table: public."Route"



CREATE TABLE public."Route"
(
    "Id_route" serial NOT NULL,
    "Origin_coord" character varying COLLATE pg_catalog."default" NOT NULL,
    "Destination_coord" character varying COLLATE pg_catalog."default" NOT NULL,
    "Duration" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Route_pkey" PRIMARY KEY ("Id_route")
)

TABLESPACE pg_default;

ALTER TABLE public."Route"
    OWNER to postgres;
-- Table: public."Status"



CREATE TABLE public."Status"
(
    "Id_status" serial NOT NULL,
    status_description character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Status_pkey" PRIMARY KEY ("Id_status"),
    CONSTRAINT "Valid_status" CHECK (status_description::text = 'In progress'::text OR status_description::text = 'Reserved'::text OR status_description::text = 'Cancelled'::text OR status_description::text = 'Done'::text) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Status"
    OWNER to postgres;

-- Table: public."User"



CREATE TABLE public."User"
(
    "Id_user" serial NOT NULL,
    "User_name" character varying COLLATE pg_catalog."default" NOT NULL,
    "User_last_name" character varying COLLATE pg_catalog."default" NOT NULL,
    "User_password" character varying COLLATE pg_catalog."default" NOT NULL,
    "User_address" character varying COLLATE pg_catalog."default" NOT NULL,
    "User_Email" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("Id_user"),
    CONSTRAINT "User_email" UNIQUE ("User_Email")
)

TABLESPACE pg_default;

ALTER TABLE public."User"
    OWNER to postgres;

-- Table: public."Vehicle"



CREATE TABLE public."Vehicle"
(
    "Id_vehicle" serial NOT NULL,
    "Plate" character varying COLLATE pg_catalog."default" NOT NULL,
    "Brand" character varying COLLATE pg_catalog."default" NOT NULL,
    "Model" character varying COLLATE pg_catalog."default" NOT NULL,
    "Payload_capacity" integer NOT NULL,
    "Photo" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("Id_vehicle")
)

TABLESPACE pg_default;

ALTER TABLE public."Vehicle"
    OWNER to postgres;

CREATE TABLE public."Haulage"
(
    "Id_haulage" serial NOT NULL,
    "Date" timestamp without time zone NOT NULL,
    "Id_user" integer NOT NULL,
    "Id_route" integer NOT NULL,
    "Id_cargo" integer NOT NULL,
    "Id_rating" integer,
    "Id_status" integer NOT NULL,
    CONSTRAINT "Haulage_pkey" PRIMARY KEY ("Id_haulage"),
    CONSTRAINT "Haulage_Id_cargo_fkey" FOREIGN KEY ("Id_cargo")
        REFERENCES public."Cargo" ("Id_cargo") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Id_rating_fkey" FOREIGN KEY ("Id_rating")
        REFERENCES public."Rating" ("Id_rating") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Id_route_fkey" FOREIGN KEY ("Id_route")
        REFERENCES public."Route" ("Id_route") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Id_status_fkey" FOREIGN KEY ("Id_status")
        REFERENCES public."Status" ("Id_status") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Id_user_fkey" FOREIGN KEY ("Id_user")
        REFERENCES public."User" ("Id_user") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Haulage"
    OWNER to postgres;
-- Table: public."Rating"
CREATE TABLE public."Bill"
(
    "Id_bill" serial NOT NULL,
    "Amount" double precision NOT NULL,
    "Id_haulage" integer NOT NULL,
    CONSTRAINT "Bill_pkey" PRIMARY KEY ("Id_bill"),
    CONSTRAINT "Bill_Id_haulage_fkey" FOREIGN KEY ("Id_haulage")
        REFERENCES public."Haulage" ("Id_haulage") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Bill"
    OWNER to postgres;

-- Table: public."Driver_Vehicle"



CREATE TABLE public."Driver_Vehicle"
(
    "Id_driver" integer NOT NULL,
    "Id_vehicle" integer NOT NULL,
    "Is_owner" boolean NOT NULL,
    CONSTRAINT "Driver_Vehicle_pkey" PRIMARY KEY ("Id_driver", "Id_vehicle"),
    CONSTRAINT "Driver_Vehicle_Id_driver_fkey" FOREIGN KEY ("Id_driver")
        REFERENCES public."Driver" ("Id_driver") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "Driver_Vehicle_Id_vehicle_fkey" FOREIGN KEY ("Id_vehicle")
        REFERENCES public."Vehicle" ("Id_vehicle") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Driver_Vehicle"
    OWNER to postgres;

-- Table: public."Haulage_Driver_Vehicle"


CREATE TABLE public."Haulage_Driver_Vehicle"
(
    "Id_haulage" integer NOT NULL,
    "Id_driver" integer NOT NULL,
    "Id_vehicle" integer NOT NULL,
    "Is_active" boolean NOT NULL,
    CONSTRAINT "Haulage_Driver_Vehicle_pkey" PRIMARY KEY ("Id_haulage", "Id_driver", "Id_vehicle"),
    CONSTRAINT "Haulage_Driver_Id_driver_fkey" FOREIGN KEY ("Id_driver")
        REFERENCES public."Driver" ("Id_driver") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Driver_Id_haulage_fkey" FOREIGN KEY ("Id_haulage")
        REFERENCES public."Haulage" ("Id_haulage") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "Haulage_Driver_Id_vehicle_fkey" FOREIGN KEY ("Id_vehicle")
        REFERENCES public."Vehicle" ("Id_vehicle") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Haulage_Driver_Vehicle"
    OWNER to postgres;