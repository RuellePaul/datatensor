import React, {
    ElementType,
    FocusEvent,
    forwardRef,
    HTMLAttributes,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
    RefAttributes,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import {Menu, MenuItem, MenuItemProps, MenuProps, styled} from '@mui/material';
import {ArrowRight} from '@mui/icons-material';

export interface NestedMenuItemProps extends Omit<MenuItemProps, 'button'> {
    /**
     * Open state of parent `<Menu />`, used to close descendent menus when the
     * root menu is closed.
     */
    parentMenuOpen: boolean;
    /**
     * Component for the container element.
     * @default 'div'
     */
    component?: ElementType;
    /**
     * Effectively becomes the `children` prop passed to the `<MenuItem/>`
     * element.
     */
    label?: ReactNode;
    /**
     * @default <ArrowRight />
     */
    rightIcon?: ReactNode;
    /**
     * Props passed to container element.
     */
    ContainerProps?: HTMLAttributes<HTMLElement> & RefAttributes<HTMLElement | null>;
    /**
     * Props passed to sub `<Menu/>` element
     */
    MenuProps?: Omit<MenuProps, 'children'>;
    /**
     * @see https://mui.com/api/list-item/
     */
    button?: true | undefined;
    /**
     *
     */
    rightAnchored?: boolean;
}

const TRANSPARENT = 'rgba(0,0,0,0)';

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
    backgroundColor: TRANSPARENT,
    '&[data-open]': {
        backgroundColor: theme.palette.action.hover
    }
}));

/**
 * Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
 * menu elements as children to this component.
 */
const NestedMenuItem = forwardRef<HTMLLIElement | null, NestedMenuItemProps>(function NestedMenuItem(props, ref) {
    const {
        parentMenuOpen,
        label,
        rightIcon = <ArrowRight />,
        children,
        className,
        tabIndex: tabIndexProp,
        ContainerProps: ContainerPropsProp = {},
        rightAnchored,
        ...MenuItemProps
    } = props;

    const {ref: containerRefProp, ...ContainerProps} = ContainerPropsProp;

    const menuItemRef = useRef<HTMLLIElement>((null as unknown) as HTMLLIElement);
    useImperativeHandle(ref, () => menuItemRef.current);

    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(containerRefProp, () => containerRef.current);

    const menuContainerRef = useRef<HTMLDivElement>(null);

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
        setIsSubMenuOpen(true);

        if (ContainerProps?.onMouseEnter) {
            ContainerProps.onMouseEnter(event);
        }
    };
    const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
        setIsSubMenuOpen(false);

        if (ContainerProps?.onMouseLeave) {
            ContainerProps.onMouseLeave(event);
        }
    };

    // Check if any immediate children are active
    const isSubmenuFocused = () => {
        const active = containerRef.current?.ownerDocument?.activeElement;
        // @ts-ignore
        for (const child of menuContainerRef.current?.children ?? []) {
            if (child === active) {
                return true;
            }
        }
        return false;
    };

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
        if (event.target === containerRef.current) {
            setIsSubMenuOpen(true);
        }

        if (ContainerProps?.onFocus) {
            ContainerProps.onFocus(event);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            return;
        }

        if (isSubmenuFocused()) {
            event.stopPropagation();
        }

        const active = containerRef.current?.ownerDocument?.activeElement;

        if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
            containerRef.current?.focus();
        }

        if (event.key === 'ArrowRight' && event.target === containerRef.current && event.target === active) {
            const firstChild = menuContainerRef.current?.children[0] as HTMLElement | undefined;
            firstChild?.focus();
        }
    };

    const open = isSubMenuOpen && parentMenuOpen;

    // Root element must have a `tabIndex` attribute for keyboard navigation
    let tabIndex;
    if (!props.disabled) {
        tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }

    return (
        <div
            {...ContainerProps}
            ref={containerRef}
            onFocus={handleFocus}
            tabIndex={tabIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
        >
            <StyledMenuItem {...MenuItemProps} data-open={open || undefined} className={className} ref={menuItemRef}>
                {label}
                <div style={{flexGrow: 1}} />
                {rightIcon}
            </StyledMenuItem>
            <Menu
                // Set pointer events to 'none' to prevent the invisible Popover div
                // from capturing events for clicks and hovers
                style={{pointerEvents: 'none'}}
                anchorEl={menuItemRef.current}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: rightAnchored ? 'left' : 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: rightAnchored ? 'right' : 'left'
                }}
                open={open}
                autoFocus={false}
                disableAutoFocus
                disableEnforceFocus
                onClose={() => {
                    setIsSubMenuOpen(false);
                }}
            >
                <div ref={menuContainerRef} style={{pointerEvents: 'auto'}}>
                    {children}
                </div>
            </Menu>
        </div>
    );
});

export default NestedMenuItem;
