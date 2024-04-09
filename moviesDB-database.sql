--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-04-04 19:01:22

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
-- TOC entry 218 (class 1259 OID 16664)
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directors (
    director_id integer NOT NULL,
    name character varying(255) NOT NULL,
    bio text,
    birth_year integer,
    death_year integer
);


ALTER TABLE public.directors OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16663)
-- Name: directors_director_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directors_director_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directors_director_id_seq OWNER TO postgres;

--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 217
-- Name: directors_director_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directors_director_id_seq OWNED BY public.directors.director_id;


--
-- TOC entry 220 (class 1259 OID 16673)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    genre_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16672)
-- Name: genres_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_genre_id_seq OWNER TO postgres;

--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 219
-- Name: genres_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_genre_id_seq OWNED BY public.genres.genre_id;


--
-- TOC entry 216 (class 1259 OID 16655)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    genre_id integer,
    director_id integer,
    image_url character varying(255),
    featured boolean
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16654)
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_movie_id_seq OWNER TO postgres;

--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 215
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- TOC entry 222 (class 1259 OID 16682)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16691)
-- Name: users_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_movies (
    user_movie_id integer NOT NULL,
    user_id integer,
    movie_id integer
);


ALTER TABLE public.users_movies OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16690)
-- Name: users_movies_user_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_movies_user_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_movies_user_movie_id_seq OWNER TO postgres;

--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_movies_user_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_movies_user_movie_id_seq OWNED BY public.users_movies.user_movie_id;


--
-- TOC entry 221 (class 1259 OID 16681)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4709 (class 2604 OID 16667)
-- Name: directors director_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors ALTER COLUMN director_id SET DEFAULT nextval('public.directors_director_id_seq'::regclass);


--
-- TOC entry 4710 (class 2604 OID 16676)
-- Name: genres genre_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN genre_id SET DEFAULT nextval('public.genres_genre_id_seq'::regclass);


--
-- TOC entry 4708 (class 2604 OID 16658)
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- TOC entry 4711 (class 2604 OID 16685)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4712 (class 2604 OID 16694)
-- Name: users_movies user_movie_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies ALTER COLUMN user_movie_id SET DEFAULT nextval('public.users_movies_user_movie_id_seq'::regclass);


--
-- TOC entry 4871 (class 0 OID 16664)
-- Dependencies: 218
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directors (director_id, name, bio, birth_year, death_year) FROM stdin;
1	Christopher Nolan	Best known for his cerebral, often nonlinear, storytelling.	1970	\N
2	Quentin Tarantino	...	1963	\N
3	Lana and Lilly Wachowski	The Wachowskis are best known for creating The Matrix series.	\N	\N
\.


--
-- TOC entry 4873 (class 0 OID 16673)
-- Dependencies: 220
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (genre_id, name, description) FROM stdin;
1	Science Fiction	A genre that deals with speculative fiction.
2	Crime	A genre that focuses on criminal activities.
3	Action	A genre characterized by action sequences and thrilling stunts.
\.


--
-- TOC entry 4869 (class 0 OID 16655)
-- Dependencies: 216
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movie_id, title, description, genre_id, director_id, image_url, featured) FROM stdin;
1	Interstellar	A sci-fi adventure film directed by Christopher Nolan.	1	1	interstellar.jpg	t
2	The Dark Knight	A superhero film directed by Christopher Nolan.	1	1	dark_knight.jpg	t
3	Inception	A mind-bending heist film directed by Christopher Nolan.	1	1	inception.jpg	f
4	Pulp Fiction	A crime film directed by Quentin Tarantino.	2	2	pulp_fiction.jpg	f
\.


--
-- TOC entry 4875 (class 0 OID 16682)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email) FROM stdin;
1	user1	password1	user1@example.com
2	user2	password2	user2@example.com
3	user3	password3	user3@example.com
\.


--
-- TOC entry 4877 (class 0 OID 16691)
-- Dependencies: 224
-- Data for Name: users_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_movies (user_movie_id, user_id, movie_id) FROM stdin;
1	1	1
2	1	2
3	2	3
\.


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 217
-- Name: directors_director_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directors_director_id_seq', 3, true);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 219
-- Name: genres_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_genre_id_seq', 3, true);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 215
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 5, true);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_movies_user_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_movies_user_movie_id_seq', 3, true);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 4716 (class 2606 OID 16671)
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (director_id);


--
-- TOC entry 4718 (class 2606 OID 16680)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 4714 (class 2606 OID 16662)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 4722 (class 2606 OID 16696)
-- Name: users_movies users_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies
    ADD CONSTRAINT users_movies_pkey PRIMARY KEY (user_movie_id);


--
-- TOC entry 4720 (class 2606 OID 16689)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4723 (class 2606 OID 16702)
-- Name: users_movies users_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies
    ADD CONSTRAINT users_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- TOC entry 4724 (class 2606 OID 16697)
-- Name: users_movies users_movies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_movies
    ADD CONSTRAINT users_movies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2024-04-04 19:01:22

--
-- PostgreSQL database dump complete
--

