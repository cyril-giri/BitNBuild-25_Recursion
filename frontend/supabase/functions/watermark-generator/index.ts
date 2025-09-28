import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json();
    if (!record) throw new Error("Payload is missing 'record' key.");

    const filePath = record.path_tokens.join('/');
    const bucketId = record.bucket_id;

    if (bucketId !== 'deliverables') {
      return new Response(JSON.stringify({ message: 'Not a deliverable, skipping.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- FIX: This block was missing. It downloads the file and defines 'fileData'. ---
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(bucketId)
      .download(filePath);
    if (downloadError) throw downloadError;
    // --- END OF FIX ---

    const image = await Image.decode(await fileData.arrayBuffer());
    
    const font = await Deno.readFile(new URL('./font.ttf', import.meta.url).pathname);
    
    const watermarkText = "PREVIEW";
    const textColor = 0xFFFFFFFF;
    const textSize = Math.round(image.width / 15);

    const textLayer = Image.renderText(font, textSize, watermarkText, textColor);
    textLayer.opacity(0.5);

    image.composite(
      textLayer,
      image.width / 2 - textLayer.width / 2,
      image.height / 2 - textLayer.height / 2
    );
    
    const watermarkedImageBuffer = await image.encode();
    const previewPath = `previews/${filePath}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketId)
      .upload(previewPath, watermarkedImageBuffer, { contentType: 'image/png', upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage.from(bucketId).getPublicUrl(previewPath);
    const originalFileUrl = supabaseAdmin.storage.from(bucketId).getPublicUrl(filePath).data.publicUrl;

    const { error: dbError } = await supabaseAdmin
      .from('deliverables')
      .update({ preview_url: publicUrlData.publicUrl })
      .eq('file_url', originalFileUrl);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, previewPath }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  }
});