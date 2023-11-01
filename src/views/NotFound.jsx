import React from 'react';
import { useEffect } from 'react';

function NotFound() {
		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('NotFound rendered');
	});
  return (
	<div>404 - Page Not Found</div>
  )
}

export default NotFound