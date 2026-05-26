import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props as any

    const permissions = auth.permissions || []

    function can(permission: string) {
        return permissions.includes(permission)
    }

    return { can }
}
