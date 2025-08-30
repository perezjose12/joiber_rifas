
import { supabaseServer } from '@/lib/supabaseServer';
export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();
        const url = new URL(imageUrl);
        let path = url.pathname.split('/storage/v1/object/public/rifas_jym/')[1];
        if (!path) {
            return Response.json({ error: 'Path inválido' }, { status: 400 });
        }
        path = decodeURIComponent(path);
        console.log(path);
        const { data, error } = await supabaseServer
            .storage
            .from('rifas_jym')
            .remove([path]);

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json({ message: 'Imagen eliminada', data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Error enviando correo" }, { status: 500 });
    }
}
