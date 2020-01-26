// global jQuery
import Cookies from 'js-cookie'
import './modernizr'
;(function($) {
	const validThemes = ['default', 'light', 'dark', 'contrast'].map(x => `az--${x}`).join(' ')

	function setTheme(theme) {
		Cookies.set('theme', theme, { expires: 90 })
		$('body')
			.removeClass(validThemes)
			.addClass(`az--${theme}`)
	}

	let fontSize = +(Cookies.get('font-size') || 16)
	function setFontSize(num = 0) {
		const newSize = fontSize + num * 2
		if (16 <= newSize && newSize <= 22) {
			fontSize = newSize
			Cookies.set('font-size', newSize, { expires: 90 })
			$('html').css('font-size', `${newSize}px`)
		}
	}

	function isMobile() {
		const viewportWidth = Math.max(
			window.innerHeight,
			document.documentElement.clientHeight,
			document.body.clientHeight,
			0
		)
		return viewportWidth < 1120
	}

	function renameNode(sel, tag) {
		const elem = $(sel)
		if (elem.length === 0) return elem
		const attributes = [...elem[0].attributes].map(attr => `${attr.name}="${attr.value}"`).join(' ')
		const newElem = $(`<${tag} ${attributes} />`).html(elem.html())
		elem.replaceWith(newElem)
		return newElem
	}

	const header = $('.az-header')
	const accessModal = $('.az-access')
	const toggleButton = $('.az-header__toggle')
	const mainMenu = $('.az-nav__menu')
	const budgetButton = $('a:contains("Encontre seu corretor")')
	const budgetModal = $('.az-modal#modal-corretor')
	const modalClose = $('.az-modal__close')

	const clonedMenu = mainMenu.clone()
	clonedMenu.attr('class', 'az-nav__cloned-menu')
	clonedMenu.insertAfter(mainMenu)

	const services = renameNode($('.az-header__services').detach(), 'div')
	services.children().each((_, elem) => renameNode(elem, 'div'))
	services.appendTo(header)

	const itemsWithSubMenu = $('.menu-item-has-children > a')
	const loginMenuItem = $('.menu-item--login > a')
	const accessMenuItems = $('.az-access__menu a')
	const goUpButton = $('.az-up')

	const headerShowMenuMod = 'az-header--show-menu'
	const menuItemExpandedMod = 'menu-item--expanded'
	const menuItemActiveMod = 'menu-item--active'
	const menuItemCurrentMod = 'current-menu-item'
	const accessModalMod = 'az-access--active'
	const accessFormMod = 'az-access__form--active'
	const modalActive = 'az-modal--active'

	toggleButton.on('click', () => header.toggleClass(headerShowMenuMod))

	goUpButton.on('click', event => {
		event.preventDefault()
		scrollTo(document.documentElement, 0, 600)
	})

	modalClose.on('click', function() {
		$(this)
			.parent()
			.parent()
			.removeClass(modalActive)
	})

	budgetButton.on('click', event => {
		event.preventDefault()
		budgetModal.toggleClass(modalActive)
	})

	itemsWithSubMenu.on('click', event => {
		if (isMobile()) {
			event.preventDefault()
			$(event.target)
				.parent()
				.toggleClass(menuItemExpandedMod)
		}
	})

	loginMenuItem.on('click', event => {
		event.preventDefault()
		accessModal.toggleClass(accessModalMod)
		$(event.target)
			.parent()
			.toggleClass(menuItemActiveMod)
	})

	accessMenuItems.on('click', event => {
		event.preventDefault()

		const item = $(event.target).parent()
		item.addClass(menuItemCurrentMod)
		item.siblings().removeClass(menuItemCurrentMod)

		const target = $(event.target.getAttribute('href'))
		target.addClass(accessFormMod)
		target.siblings().removeClass(accessFormMod)
	})

	services.on('init', () => {
		$('a:contains("2ª via")').on('click', event => {
			event.preventDefault()
			$('.az-modal#modal-2a-via').toggleClass(modalActive)
		})
	})

	services.slick({
		infinite: false,
		slidesToShow: 5,
		slidesToScroll: 5,
		mobileFirst: false,
		responsive: [
			{ breakpoint: 350, settings: { slidesToShow: 2, slidesToScroll: 2 } },
			{ breakpoint: 530, settings: { slidesToShow: 3, slidesToScroll: 3 } },
			{ breakpoint: 650, settings: { slidesToShow: 4, slidesToScroll: 4 } },
		],
	})

	$('.az-a11y__theme--default').on('click', () => setTheme('default'))
	$('.az-a11y__theme--light').on('click', () => setTheme('light'))
	$('.az-a11y__theme--dark').on('click', () => setTheme('dark'))
	$('.az-a11y__theme--contrast').on('click', () => setTheme('contrast'))
	$('.az-a11y__increase').on('click', () => setFontSize(+1))
	$('.az-a11y__decrease').on('click', () => setFontSize(-1))

	const theme = Cookies.get('theme') || 'default'
	setTheme(theme)
	setFontSize()
})(jQuery)

function scrollTo(element, to, duration = 400) {
	const start = element.scrollTop
	const change = to - start
	const increment = 20

	let currentTime = 0
	const animateScroll = function() {
		currentTime += increment
		const val = Math.easeInOutQuad(currentTime, start, change, duration)
		element.scrollTop = val
		if (currentTime < duration) {
			setTimeout(animateScroll, increment)
		}
	}

	animateScroll()
}

Math.easeInOutQuad = function(time, start, change, duration) {
	time /= duration / 2
	if (time < 1) return (change / 2) * time * time + start
	time--
	return (-change / 2) * (time * (time - 2) - 1) + start
}
