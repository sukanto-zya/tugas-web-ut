<?php
	if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
		$uri = 'https://';
	} else {
		$uri = 'http://';
	}
	$uri .= $_SERVER['HTTP_HOST'];
	
	// Arahkan langsung ke file login Anda, bukan ke index.php ini lagi
	header('Location: '.$uri.'/ut-terbuka/login.html'); 
	exit;
?>