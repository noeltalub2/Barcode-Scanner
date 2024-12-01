-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2024 at 04:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barcode_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `class_id` int(11) NOT NULL,
  `log_date` varchar(15) NOT NULL,
  `status` varchar(10) NOT NULL,
  `logs` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `faculty_id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `room_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `subject_id`, `faculty_id`, `class_name`, `room_number`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'CT 1A', '201', '2024-12-01 14:52:28', '2024-12-01 14:52:28'),
(2, 2, 5, 'CT 2A', '202', '2024-12-01 14:56:35', '2024-12-01 14:56:35'),
(3, 3, 3, 'CT 3A', '201', '2024-12-01 14:58:45', '2024-12-01 14:58:45');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `profile_url` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `registration_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`, `username`, `email`, `password`, `profile_url`, `is_active`, `registration_status`, `created_at`, `updated_at`) VALUES
(1, 'Shelamae C. Queja', 'shela', 'shela.queja@gmail.com', '$2b$10$ThGF9vqLlxDa4gvKMatSz.bOLH1ePY9WLMqM.HySLUIaaV4K1VBhu', 'default.jpg', 1, 'approved', '2024-12-01 22:47:38', '2024-12-01 23:16:59'),
(2, 'Jack I. Bagbaga', 'jack', 'jack@email.com', '$2b$10$ThGF9vqLlxDa4gvKMatSz.bOLH1ePY9WLMqM.HySLUIaaV4K1VBhu', 'default.jpg', 1, 'approved', '2024-12-01 22:47:57', '2024-12-01 23:17:25'),
(3, 'Crysp Tonette Tolentino Queja', 'Crysp', 'crysp.tonette.queja@gmail.com', '$2b$10$ThGF9vqLlxDa4gvKMatSz.bOLH1ePY9WLMqM.HySLUIaaV4K1VBhu', 'default.jpg', 1, 'approved', '2024-12-01 22:48:22', '2024-12-01 23:17:29'),
(4, 'Rommel Viloria', 'rommel@gmail.com', 'rommel@gmail.com', '$2b$10$ThGF9vqLlxDa4gvKMatSz.bOLH1ePY9WLMqM.HySLUIaaV4K1VBhu', 'default.jpg', 1, 'approved', '2024-12-01 22:49:40', '2024-12-01 23:17:33'),
(5, 'Peng Lustiva', 'peng', 'peng@gmail.com', '$2b$10$ThGF9vqLlxDa4gvKMatSz.bOLH1ePY9WLMqM.HySLUIaaV4K1VBhu', 'default.jpg', 1, 'approved', '2024-12-01 22:50:39', '2024-12-01 23:17:35');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `degree` varchar(45) NOT NULL,
  `year_section` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `student_id`, `name`, `email`, `degree`, `year_section`, `created_at`, `updated_at`) VALUES
(1, '24-070800', 'Ceredon, Jane Cassandra', 'janecassandra05ceredon@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(2, '23-050629', 'Espirito, Olivia lynne A.', 'espiritoolivia@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(3, '24-070026', 'Maladecino, Elysha Faith M.', 'eshangg04@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(4, '24-070764', 'Viernes, Troy Armand G.', 'troyviernes0333@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(5, '24-070710', 'Balino, Wilmark M.', 'balinowilmark@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(6, '24-070756', 'Espirito, Tristan Earl P.', 'tristanespiritu341@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(7, '24-070780', 'Estrera, John Mark J.', 'estreraj44@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(8, '24-071044', 'Dagupion, Janine E.', 'janinedagupion28@gmail', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(9, '24-070707', 'Naidas, Blake Narciso D.', 'blakenarciso1027@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(10, '24-071048', 'Balanay, Karylle S.', 'karyllebalanay722@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(11, '24-070038', 'Agonoy, Jayroflor A.', 'jayroyonoga@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(12, '24-070813', 'Bagcal, Riobell O.', 'belledelacruzbagcal@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(13, '24-070040', 'Agcaoili Jomari A.', 'agcaoilijomari12@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(14, '24-070757', 'Matias, Khae Mikaela T.', 'matiaskhaemikaela@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(15, '24-070214', 'Inay, John Lloyd', 'inayjohnlloyd50@gmail.com', 'CT', '1-A', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(16, '24-071031', 'Paulino, Kathleen Leah', 'leahpaulino12@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(17, '24-070867', 'Erorita, Mark Joseph S.', 'marcjosepherorita@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(18, '24-070857', 'Mamala, Jeremy V.', 'jeremymamala81@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(19, '24-071049', 'Gambol, Edith B.', 'edithgambol@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(20, '24-071065', 'Ataup, Rizaleen B.', 'rizaleenataup@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(21, '24-070811', 'Amolocion, Joana Claire G.', 'joanaclairegametamolacion@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(22, '24-070011', 'Tabieza, Keisha Camille C.', 'keishatabieza2006@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(23, '24-070166', 'Balisacan, Terence Neil L.', 'terencebalisacan07@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(24, '24-070793', 'Campos, Christian Kyle L.', 'christiankylecampos29@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(25, '24-070856', 'Fernando, Jearome D.', 'jearome52@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(26, '24-070019', 'Salvador,  Dexter B.', 'sinichibenedag@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(27, '24-070018', 'Corpuz, Mark Yhoedel', 'markyhoedel@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(28, '24-070224', 'Acoba, Louis Anthony', 'louisanthonyacoba71@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(29, '19-040527', 'Domingo, John Michael Q.', 'johnmichaelquimoyog@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(30, '24-070208', 'Agoto Jodel Ralf C.', 'jodelralf.agato01@gmail.com', 'CT', '1-B', '2024-12-01 22:42:31', '2024-12-01 22:42:31'),
(31, '23-070322', 'Ramos, Angel Aytona', 'angelramos092903@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(32, '23-070405', 'Fuster, Patricia Ann E.', 'patriciaebiofuster@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(33, '23-070201', 'Bismanos, Jesiel', 'jesielbismanossarvida@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(34, '23-070200', 'Campos, Rafael Manalo', 'rafaelcampos0999@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(35, '23-070035', 'Rivera, Goldwin', 'goldwingaming7@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(36, '23-070287', 'Sarabia, Marlon M. Jr.', 'marlon.sarabia44@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(37, '23-070577', 'Nava, Jennieva', 'jennievanava2004@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(38, '23-070363', 'Gabriel, Kristina Cristel', 'kristinacristel@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(39, '23-070319', 'Cainong, Jhobelyn R.', 'cainongramosjhobelyn@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(40, '23-070465', 'Laguisad, Rhixian Zade D.', 'laguisadrhixian@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(41, '23-070540', 'Talaña, Christian Jay', 'christianjaytalana@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(42, '23-070246', 'Taneo, Lharey Jolo F.', 'jolotaneo21@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(43, '23-070387', 'Ciriaco, Jericho', 'ciriacojericho5@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(44, '23-070429', 'Yasay, Jerwin Jake', 'yasayjerwinjake@gmail.com', 'CT', '2-A', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(45, '23-070320', 'Delos Reyes, Ronan Haven A.', 'ronandlr06@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(46, '23-070512', 'Silva, Shyna Jee P.', 'shynasilva@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(47, '23-070468', 'Manuel, Jessica', 'manueljessica081@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(48, '23-070037', 'Mag-atas, Carlo', 'carlomagatas0@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(49, '23-070480', 'Corpuz, Chriswayne M.', 'ewengchriswaynecorpuz.gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(50, '23-070252', 'Pungtilan, Jomark O.', 'jomarkpungtilan44@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(51, '23-070598', 'Dagdagan, Dane Allen C.', 'allendagdagancoloma@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(52, '23-070150', 'Pimentel, Mark Jansen', 'markjpimentel58@gmail.coom', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(53, '23-070315', 'Ramos, Carl Yoner F.', 'carlramosflores@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(54, '23-070248', 'Dagan, Ashley', 'ashleydagan599@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(55, '23-070481', 'Tolentino, Gracela Ana Grace', 'anagracetolentino@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(56, '23-070247', 'Paleracio, Judy Ann', 'paleraciojudyann@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(57, '23-070489', 'Nocum, Jhozen Rayle B.', 'yachierayle@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(58, '23-070362', 'Padamada, Roda', 'rhodapadamada18@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(59, '23-070400', 'Cadiz, Joash Jericho G.', 'cadizjericho302@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(60, '22-150500', 'Ocol, John Paul M.', 'johnpaulocol@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(61, '23-070648', 'Madamba, Roger Dave V.', 'madambarogerdave5@gmail.com', 'CT', '2-B', '2024-12-01 22:44:02', '2024-12-01 22:44:02'),
(62, '22-070601', 'Cruzado, Atheia Marie', 'cruzadotheia8@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(63, '20-051070', 'Burogsay, Rostom M.', 'rostomburogsay20@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(64, '19-070386', 'Bawingan, Shadrach', 'srb.bawingan20@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(65, '19-070308', 'Domingo, Jerome', 'jeromedomingo2701@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(66, '22-070520', 'Balanay, Klye Salviejo', 'klye.balanay8@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(67, '22-070533', 'Bartolome, Iris T.', 'irrissbartolome@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(68, '20-070390', 'Pajinag, Erickson Jade P.', 'pajinagjade@gamil.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(69, '22-071006', 'Cariaga, Christian Dave', 'christiandavecariaga1@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(70, '22-071012', 'Galang, Ronan Dangcil', 'ronangalng071804@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(71, '22-070558', 'Megio, Rogel M.', 'rogelmegio23@gmail.com', 'CT', '3-A', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(72, '22-070661', 'Alegado, JayArce P.', 'jayarcealegado8@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(73, '22-070543', 'Antolin, Michael B.', 'michaelantolin310@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(74, '22-071029', 'Maneja, Keith Jonah Gien R.', 'keithmaneja09@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(75, '22-070538', 'Ela Carinae Dizon V.', 'carinaedizon@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(76, '22-070537', 'Umbay, Freimelyn V.', 'freimelynumbay@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(77, '22-070556', 'Jara, Rose Anne R.', 'roseannejara@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(78, '22-070737', 'Rangasan, Jemalyn L.', 'jemalynrangasan@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(79, '22-070739', 'Cainglit, Kristine Joy J.', 'kristinejoycainglit18@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(80, '22-071133', 'Corpuz, Christian Dave', 'christiandavecorpuz@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(81, '22-070525', 'Alipio, Tristan Alistair B.', 'tristanalistaira@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(82, '20-070313', 'Maluar, Garrgtte Bryan B.', 'garrdtebryan2001@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(83, '21-050262', 'Valenzuelo, Kees Leigh Ann G.', 'kessv@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(84, '22-070524', 'Bataan, Jansen A.', 'jansenbataan0818@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(85, '22-071189', 'Andres, Bryan Jhay A.', 'abryanjhay@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(86, '22-071116', 'Mendoza, Andrei M.', 'mendozaandrei0824@gmail.com', 'CT', '3-B', '2024-12-01 22:44:31', '2024-12-01 22:44:31'),
(87, '21-070019', 'Yumang,Jan Axl C.', 'yumang1104@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(88, '21-070105', 'Arellano,Keithley Jhon B.', 'keithleyjhonarellano@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(89, '21-070395', 'Cabales, Jeramae D.', 'cabalesj80@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(90, '21-070030', 'Cañada,Stephen Lester M.', 'canadastephen57@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(91, '21-070071', 'Baylon,Joel C.', 'baylonjoel53@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(92, '21-070123', 'Madrilino,Khate Ann B,', 'khatem014@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(93, '21-070057', 'Lacar,Vince Karl D.', 'lacarvincekarl25@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(94, '21-070176', 'Agudelo,Shena B.', 'shenabaclagan@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(95, '21-070026', 'Benito,Jade Q.', 'jadebenito27@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(96, '21-070475', 'Tagala,John Vincent', 'jvincent0420@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(97, '21-070061', 'Asuncion,Reynalyn B.', 'asuncionreynalyn42@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(98, '20-070571', 'Dela Cruz,Axl A.', 'axlchuan923@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(99, '21-070097', 'Cabasag,Angelica', 'angelicacabasag@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(100, '21-070121', 'Mandac,Ethan Jamen A.', 'Coolutsky69@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(101, '21-070203', 'Fiesta,Marc Prympt', 'marcprymptfiesta@gmail.com', 'CT', '4-A', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(102, '21-070174', 'Queja,Shelamae C.', 'shela.queja@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(103, '21-070258', 'Agarano,Kathleen-Anne L.', 'agaranokatheen@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(104, '21-070086', 'Lustiva,Marife U.', 'penglustiva@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(105, '21-070132', 'Tagala,Kyle Daniel M.', 'ktagala89@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(106, '21-070044', 'Palma,Jessie C.', 'jessiepalma77@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(107, '21-070063', 'Bis,Jefferson V.', 'bisjefferson627@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(108, '21-070125', 'Aguete,Hannah Cezanne C.', 'cezanneaguete@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(109, '19-070173', 'Juan,Jenny O.', 'jj9763954@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(110, '21-070032', 'Viernes,John Paul', 'jaypeefriday23@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(111, '21-070036', 'Morales,Jherick J.', 'jherickmorales0@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(112, '21-070173', 'Sacli,Mark Laurence L.', 'saclimarklaurence@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(113, '21-070088', 'Parubrub,John Ryan M.', 'johnryanmorales07@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(114, '21-070079', 'Ramos,Jose Marlon V.', 'ramosjose1002@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(115, '21-070397', 'Calaranan,Janah Mae', 'maejanah0714@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07'),
(116, '21-070040', 'Montero,John Lloyd T.', 'johnmontero215@gmail.com', 'CT', '4-B', '2024-12-01 22:46:07', '2024-12-01 22:46:07');

-- --------------------------------------------------------

--
-- Table structure for table `student_class`
--

CREATE TABLE `student_class` (
  `student_class_id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `class_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_class`
--

INSERT INTO `student_class` (`student_class_id`, `student_id`, `class_id`, `faculty_id`, `enrolled_at`) VALUES
(1, '24-070800', 1, 2, '2024-12-01 15:01:44'),
(2, '23-050629', 1, 2, '2024-12-01 15:01:44'),
(3, '24-070026', 1, 2, '2024-12-01 15:01:44'),
(4, '24-070764', 1, 2, '2024-12-01 15:01:44'),
(5, '24-070710', 1, 2, '2024-12-01 15:01:44'),
(6, '24-070756', 1, 2, '2024-12-01 15:01:44'),
(7, '24-070780', 1, 2, '2024-12-01 15:01:44'),
(8, '24-071044', 1, 2, '2024-12-01 15:01:44'),
(9, '24-070707', 1, 2, '2024-12-01 15:01:44'),
(10, '24-071048', 1, 2, '2024-12-01 15:01:44'),
(11, '24-070038', 1, 2, '2024-12-01 15:01:44'),
(12, '24-070813', 1, 2, '2024-12-01 15:01:44'),
(13, '24-070040', 1, 2, '2024-12-01 15:01:44'),
(14, '24-070757', 1, 2, '2024-12-01 15:01:44'),
(15, '24-070214', 1, 2, '2024-12-01 15:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `semester` varchar(255) NOT NULL,
  `academic_year` varchar(255) NOT NULL,
  `time_day` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `description`, `semester`, `academic_year`, `time_day`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Programming ', 'PROG01', 'ABOUT PROGRAMMING', '1st', '2023-2024', 'Monday-Wednesday 10:00AM', 'Lab', '2024-12-01 14:52:01', '2024-12-01 14:52:01'),
(2, 'WEB DEVELOPMENT', 'CPTR 250', 'ABOUT WEBDEV', '2nd', '2023-2024', 'Tuesday/Thursday 11-1:00pm', 'Lab', '2024-12-01 14:56:04', '2024-12-01 14:56:04'),
(3, 'DATABASE MANAGEMENT', 'CPTR', 'ABOUT DATABASE MYSQL', 'Midyear', '2023-2024', 'MON-WED 1:00-3:00pm', 'Lab', '2024-12-01 14:58:17', '2024-12-01 15:16:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` enum('admin','faculty') NOT NULL DEFAULT 'faculty',
  `profile_url` varchar(255) DEFAULT 'default.jpg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `role`, `profile_url`, `created_at`, `updated_at`) VALUES
(2, 'Administrator', 'admin', 'admin@gmail.com', '$2a$12$WFr2SLARMnucaGAIMo6E5OMxXKmeyYeGibAV8DYvrseFoxDl45q/q', 'admin', 'default.jpg', '2024-10-15 17:57:05', '2024-11-10 00:10:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student_class`
--
ALTER TABLE `student_class`
  ADD PRIMARY KEY (`student_class_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_code` (`subject_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `student_class`
--
ALTER TABLE `student_class`
  MODIFY `student_class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`);

--
-- Constraints for table `student_class`
--
ALTER TABLE `student_class`
  ADD CONSTRAINT `student_class_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`),
  ADD CONSTRAINT `student_class_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `student_class_ibfk_3` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
