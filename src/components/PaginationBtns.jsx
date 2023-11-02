import { useStateContext } from "../context/ContextProvider"
import { useEffect } from 'react';

function PaginationBtns({pages, getLinks}) {

	const {setLoading} = useStateContext();

	const onGetLinks = (url) => {
		setLoading(true);
		getLinks(url, false, true)
	};

		// test render
	// eslint-disable-next-line
	useEffect(() => {
		console.log('PaginationBtns rendered');
	});

  return (
	<>
	{pages.total !== 0 && <p className="ml">{pages.from === pages.to ? pages.to : `${pages.from} - ${pages.to}` } | {pages.total}</p>}
	<ul className='page-btns'>
		{pages.links.map(link => {
			if (link.label == '&laquo; Previous' && pages.current_page === 1) {
				return 
			}
			if (link.label == 'Next &raquo;' && pages.current_page == pages.last_page) {
				return 
			}
			return <li key={link.label}><div className={`btn-logout${link.active ? ' btn-add white-text' : ''}`} onClick={() => onGetLinks(link.url)}>{link.label === '&laquo; Previous' ? 'previous' : link.label === 'Next &raquo;' ? 'next' : link.label }</div></li>
		})}
	</ul>
	</>
  )
}

export default PaginationBtns