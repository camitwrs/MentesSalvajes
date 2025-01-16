--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-01-16 13:09:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 34786)
-- Name: alternativas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alternativas (
    idalternativa integer NOT NULL,
    idpregunta integer NOT NULL,
    caracteristicaalternativa text,
    textoalternativa text NOT NULL
);


ALTER TABLE public.alternativas OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 34785)
-- Name: alternativas_idalternativa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alternativas_idalternativa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alternativas_idalternativa_seq OWNER TO postgres;

--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 225
-- Name: alternativas_idalternativa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alternativas_idalternativa_seq OWNED BY public.alternativas.idalternativa;


--
-- TOC entry 221 (class 1259 OID 34752)
-- Name: cuestionarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuestionarios (
    idcuestionario integer NOT NULL,
    titulocuestionario character varying(255) NOT NULL,
    descripcioncuestionario text,
    fechacreacioncuestionario timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cuestionarios OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 34751)
-- Name: cuestionarios_idcuestionario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuestionarios_idcuestionario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuestionarios_idcuestionario_seq OWNER TO postgres;

--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 220
-- Name: cuestionarios_idcuestionario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuestionarios_idcuestionario_seq OWNED BY public.cuestionarios.idcuestionario;


--
-- TOC entry 219 (class 1259 OID 34739)
-- Name: educadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.educadores (
    ideducador integer NOT NULL,
    tituloprofesionaleducador character varying(255),
    intereseseducador text,
    paiseducador character varying(100),
    edadeducador integer,
    institucioneducador character varying(255),
    sexoeducador character varying(20)
);


ALTER TABLE public.educadores OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 34828)
-- Name: ilustraciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ilustraciones (
    idilustracion integer NOT NULL,
    titulollustracion character varying(255) NOT NULL,
    descripcionllustracion text,
    archivollustracion bytea,
    fechacargallustracion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estadollustracion character varying(50) DEFAULT 'pendiente'::character varying,
    fechaasignacionllustracion timestamp without time zone,
    ideducador integer,
    iddisenador integer
);


ALTER TABLE public.ilustraciones OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 34827)
-- Name: ilustraciones_idilustracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ilustraciones_idilustracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ilustraciones_idilustracion_seq OWNER TO postgres;

--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 229
-- Name: ilustraciones_idilustracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ilustraciones_idilustracion_seq OWNED BY public.ilustraciones.idilustracion;


--
-- TOC entry 224 (class 1259 OID 34767)
-- Name: preguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas (
    idpregunta integer NOT NULL,
    idcuestionario integer NOT NULL,
    textopregunta text NOT NULL,
    tipopregunta character varying(255) NOT NULL
);


ALTER TABLE public.preguntas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 34766)
-- Name: preguntas_idpregunta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.preguntas_idpregunta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preguntas_idpregunta_seq OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 223
-- Name: preguntas_idpregunta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.preguntas_idpregunta_seq OWNED BY public.preguntas.idpregunta;


--
-- TOC entry 228 (class 1259 OID 34800)
-- Name: respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas (
    idrespuesta integer NOT NULL,
    idusuario integer NOT NULL,
    idpregunta integer NOT NULL,
    idalternativa integer NOT NULL,
    idcuestionario integer NOT NULL,
    fecharespuesta timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.respuestas OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 34799)
-- Name: respuestas_idrespuesta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respuestas_idrespuesta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respuestas_idrespuesta_seq OWNER TO postgres;

--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 227
-- Name: respuestas_idrespuesta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respuestas_idrespuesta_seq OWNED BY public.respuestas.idrespuesta;


--
-- TOC entry 216 (class 1259 OID 34716)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    idrol integer NOT NULL,
    nombrerol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 34715)
-- Name: roles_idrol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_idrol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_idrol_seq OWNER TO postgres;

--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_idrol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_idrol_seq OWNED BY public.roles.idrol;


--
-- TOC entry 222 (class 1259 OID 34761)
-- Name: tipopreguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipopreguntas (
    tipopregunta character varying(255) NOT NULL
);


ALTER TABLE public.tipopreguntas OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 34723)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    idusuario integer NOT NULL,
    nombreusuario character varying(100) NOT NULL,
    apellidousuario character varying(100) NOT NULL,
    correousuario character varying(100) NOT NULL,
    contrasenausuario character varying(255) NOT NULL,
    fecharegistrousuario timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    idrol integer NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 34722)
-- Name: usuarios_idusuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_idusuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_idusuario_seq OWNER TO postgres;

--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_idusuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_idusuario_seq OWNED BY public.usuarios.idusuario;


--
-- TOC entry 4732 (class 2604 OID 34789)
-- Name: alternativas idalternativa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativas ALTER COLUMN idalternativa SET DEFAULT nextval('public.alternativas_idalternativa_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 34755)
-- Name: cuestionarios idcuestionario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuestionarios ALTER COLUMN idcuestionario SET DEFAULT nextval('public.cuestionarios_idcuestionario_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 34831)
-- Name: ilustraciones idilustracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ilustraciones ALTER COLUMN idilustracion SET DEFAULT nextval('public.ilustraciones_idilustracion_seq'::regclass);


--
-- TOC entry 4731 (class 2604 OID 34770)
-- Name: preguntas idpregunta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas ALTER COLUMN idpregunta SET DEFAULT nextval('public.preguntas_idpregunta_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 34803)
-- Name: respuestas idrespuesta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas ALTER COLUMN idrespuesta SET DEFAULT nextval('public.respuestas_idrespuesta_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 34719)
-- Name: roles idrol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN idrol SET DEFAULT nextval('public.roles_idrol_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 34726)
-- Name: usuarios idusuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN idusuario SET DEFAULT nextval('public.usuarios_idusuario_seq'::regclass);


--
-- TOC entry 4753 (class 2606 OID 34793)
-- Name: alternativas alternativas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativas
    ADD CONSTRAINT alternativas_pkey PRIMARY KEY (idalternativa);


--
-- TOC entry 4747 (class 2606 OID 34760)
-- Name: cuestionarios cuestionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuestionarios
    ADD CONSTRAINT cuestionarios_pkey PRIMARY KEY (idcuestionario);


--
-- TOC entry 4745 (class 2606 OID 34745)
-- Name: educadores educadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educadores
    ADD CONSTRAINT educadores_pkey PRIMARY KEY (ideducador);


--
-- TOC entry 4757 (class 2606 OID 34837)
-- Name: ilustraciones ilustraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ilustraciones
    ADD CONSTRAINT ilustraciones_pkey PRIMARY KEY (idilustracion);


--
-- TOC entry 4751 (class 2606 OID 34774)
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (idpregunta);


--
-- TOC entry 4755 (class 2606 OID 34806)
-- Name: respuestas respuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (idrespuesta);


--
-- TOC entry 4739 (class 2606 OID 34721)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (idrol);


--
-- TOC entry 4749 (class 2606 OID 34765)
-- Name: tipopreguntas tipopreguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipopreguntas
    ADD CONSTRAINT tipopreguntas_pkey PRIMARY KEY (tipopregunta);


--
-- TOC entry 4741 (class 2606 OID 34733)
-- Name: usuarios usuarios_correousuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correousuario_key UNIQUE (correousuario);


--
-- TOC entry 4743 (class 2606 OID 34731)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (idusuario);


--
-- TOC entry 4762 (class 2606 OID 34794)
-- Name: alternativas alternativas_idpregunta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alternativas
    ADD CONSTRAINT alternativas_idpregunta_fkey FOREIGN KEY (idpregunta) REFERENCES public.preguntas(idpregunta) ON DELETE CASCADE;


--
-- TOC entry 4759 (class 2606 OID 34746)
-- Name: educadores educadores_ideducador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.educadores
    ADD CONSTRAINT educadores_ideducador_fkey FOREIGN KEY (ideducador) REFERENCES public.usuarios(idusuario) ON DELETE CASCADE;


--
-- TOC entry 4767 (class 2606 OID 34843)
-- Name: ilustraciones ilustraciones_iddisenador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ilustraciones
    ADD CONSTRAINT ilustraciones_iddisenador_fkey FOREIGN KEY (iddisenador) REFERENCES public.usuarios(idusuario) ON DELETE SET NULL;


--
-- TOC entry 4768 (class 2606 OID 34838)
-- Name: ilustraciones ilustraciones_ideducador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ilustraciones
    ADD CONSTRAINT ilustraciones_ideducador_fkey FOREIGN KEY (ideducador) REFERENCES public.educadores(ideducador) ON DELETE SET NULL;


--
-- TOC entry 4760 (class 2606 OID 34775)
-- Name: preguntas preguntas_idcuestionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_idcuestionario_fkey FOREIGN KEY (idcuestionario) REFERENCES public.cuestionarios(idcuestionario) ON DELETE CASCADE;


--
-- TOC entry 4761 (class 2606 OID 34780)
-- Name: preguntas preguntas_tipopregunta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_tipopregunta_fkey FOREIGN KEY (tipopregunta) REFERENCES public.tipopreguntas(tipopregunta) ON DELETE CASCADE;


--
-- TOC entry 4763 (class 2606 OID 34817)
-- Name: respuestas respuestas_idalternativa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_idalternativa_fkey FOREIGN KEY (idalternativa) REFERENCES public.alternativas(idalternativa) ON DELETE CASCADE;


--
-- TOC entry 4764 (class 2606 OID 34822)
-- Name: respuestas respuestas_idcuestionario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_idcuestionario_fkey FOREIGN KEY (idcuestionario) REFERENCES public.cuestionarios(idcuestionario) ON DELETE CASCADE;


--
-- TOC entry 4765 (class 2606 OID 34812)
-- Name: respuestas respuestas_idpregunta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_idpregunta_fkey FOREIGN KEY (idpregunta) REFERENCES public.preguntas(idpregunta) ON DELETE CASCADE;


--
-- TOC entry 4766 (class 2606 OID 34807)
-- Name: respuestas respuestas_idusuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_idusuario_fkey FOREIGN KEY (idusuario) REFERENCES public.usuarios(idusuario) ON DELETE CASCADE;


--
-- TOC entry 4758 (class 2606 OID 34734)
-- Name: usuarios usuarios_idrol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_idrol_fkey FOREIGN KEY (idrol) REFERENCES public.roles(idrol) ON DELETE CASCADE;


-- Completed on 2025-01-16 13:09:04

--
-- PostgreSQL database dump complete
--

